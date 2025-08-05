export type GithubIssueRef = {
  repositoryOwner: string;
  repositoryName: string;
  issueNumber: number;
}

type GithubIssueData = {
  title: string;
  body: string;
  labels: Array<{
    name: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};


export async function generateReport(ref: GithubIssueRef): Promise<string> {
  const data = await fetchData(ref);

  if (data instanceof Error) {
    return `Could not fetch data for ${tagRef(ref)} due to ${tagError(data)}.`
  } else if (isSep(data)) {
    return generateReportForSep(ref, data);
  } else {
    return `${tagRef(ref)} is OK (not an SEP).`
  }
}


function tag(tagName: string, content: string): string {
  return `<${tagName}>${content}</${tagName}>`;
}

function tagAll(outerTagName: string, innerTagsName: string, contentArray: string[]): string {
  return tag(outerTagName, contentArray.map((content) => tag(innerTagsName, content)).join(" "));
}

function tagError(error: Error): string {
  return tag("error", error.message);
}

function tagRef({ repositoryOwner, repositoryName, issueNumber }: GithubIssueRef): string {
  return tag("github_issue", `${repositoryOwner}/${repositoryName}#${issueNumber}`);
}


async function fetchData(
  { repositoryOwner, repositoryName, issueNumber }: GithubIssueRef
): Promise<GithubIssueData | Error> {
  const url = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/issues/${issueNumber}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Error(`The server responded with status "${response.status} ${response.statusText}"`)
    } else {
      return await response.json() as GithubIssueData;
    }
  } catch (error) {
    return error as Error;
  }
}


function isSep({ title, labels }: GithubIssueData): boolean {
  return /^SEP\b/.test(title) || labels.some(label => label.name === "SEP");
}


const sepStates = ["proposal", "draft", "in-review", "accepted", "rejected", "withdrawn", "final", "superseded", "dormant"];
const sepRequiredSections = ["Preamble", "Abstract", "Motivation", "Specification", "Rationale"];

function generateReportForSep(ref: GithubIssueRef, { title, labels, body }: GithubIssueData): string {
  const problems: string[] = [];

  // Check title
  const correctedTitle = title.replace(/^(?:SEP[- ]?(\d+)?:?\s*)?/, (match, id) => {
    if (id === ref.issueNumber.toString()) {
      return match;
    } else if (id) {
      return `SEP-${ref.issueNumber}: ${match}`;
    } else {
      return `SEP-${ref.issueNumber}: `;
    }
  });
  if (title !== correctedTitle) {
    problems.push(`Title should be: ${tag("title", correctedTitle)}.`);
  }

  // Check labels
  const correctedLabels = labels.map(label => label.name);
  if (!sepStates.some((state) => correctedLabels.includes(state))) {
    correctedLabels.push("proposal");
  }
  if (!correctedLabels.includes("SEP")) {
    correctedLabels.push("SEP");
  }
  if (correctedLabels.length > labels.length) {
    problems.push(`Labels should be: ${tagAll("issue_labels", "label", correctedLabels)}.`);
  }

  // Check sections
  const headings = extractHeadings(body);
  const missingSections = sepRequiredSections.filter((section) => !headings.includes(section));
  if (missingSections.length > 0) {
    problems.push(`Sections are missing: ${tagAll("missing_sections", "section", missingSections)}.`);
  }

  if (problems.length === 0) {
    return `${tagRef(ref)} is OK.`
  } else {
    return `${tagRef(ref)} has the following problems: ${tagAll("problems", "problem", problems)}.`
  }
}


function extractHeadings(text: string): string[] {
  const headingRegex = /^#+[ ]*(.+?)[ ]*$|<(?<tag>h[1-6])>\s*(.+?)\s*<\/\k<tag>>/mig;
  return [...text.matchAll(headingRegex)].map(match => match[1] || match[2] as string);
}
