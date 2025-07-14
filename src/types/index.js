/**
 * @typedef {Object} User
 * @property {string} login - GitHub username.
 * @property {number} id - GitHub user ID.
 * @property {string} avatar_url - Profile picture URL.
 * @property {string} html_url - Link to GitHub profile.
 * @property {string|null} name - Display name (may be null).
 * @property {string|null} company - User's company (optional).
 * @property {string|null} blog - Blog or personal website (optional).
 * @property {string|null} location - Location info (optional).
 * @property {string|null} email - Email if public (optional).
 * @property {string|null} bio - Short biography (optional).
 * @property {number} public_repos - Count of public repositories.
 * @property {number} public_gists - Count of public gists.
 * @property {number} followers - Number of followers.
 * @property {number} following - Number of people the user follows.
 * @property {string} created_at - Account creation date.
 * @property {string} updated_at - Last profile update.
 */

/**
 * @typedef {Object} Repository
 * @property {number} id - Repository ID.
 * @property {string} name - Repository short name.
 * @property {string} full_name - Owner/repo format name.
 * @property {{login: string, id: number, avatar_url: string}} owner - Basic owner info.
 * @property {string} html_url - Link to the repository.
 * @property {string|null} description - Description text (optional).
 * @property {boolean} fork - Is this repo a fork?
 * @property {string} created_at - Repo creation date.
 * @property {string} updated_at - Last updated date.
 * @property {string} pushed_at - Last push timestamp.
 * @property {string|null} homepage - Optional homepage URL.
 * @property {number} size - Size of the repository in KB.
 * @property {number} stargazers_count - Number of stars.
 * @property {number} watchers_count - Number of watchers.
 * @property {string|null} language - Primary language used.
 * @property {number} forks_count - Number of forks.
 * @property {number} open_issues_count - Number of open issues.
 * @property {{key: string, name: string, url: string}|null} license - License info (optional).
 * @property {string[]} topics - Tags/topics assigned to the repo.
 * @property {string} visibility - Visibility (e.g. public/private).
 * @property {string} default_branch - Default branch name.
 */

/**
 * @typedef {Object} TreeNode
 * @property {string} path - Path of the file/folder.
 * @property {'blob'|'tree'} type - 'blob' = file, 'tree' = folder.
 * @property {string} sha - SHA hash of the object.
 * @property {string} url - GitHub API URL to fetch this node.
 * @property {TreeNode[]=} children - Nested children (for folders).
 */

/**
 * @typedef {Object} TreeData
 * @property {string} sha - Root SHA of the tree.
 * @property {string} url - API URL to get tree.
 * @property {TreeNode[]} tree - Array of top-level nodes.
 */

/**
 * @typedef {Object} FlowNode
 * @property {string} id - Unique ID for the node.
 * @property {string} type - Node type (e.g., 'default').
 * @property {{label: string, path: string, type: string}} data - Display and meta info.
 * @property {{x: number, y: number}} position - Position in the chart.
 */

/**
 * @typedef {Object} FlowEdge
 * @property {string} id - Unique edge ID.
 * @property {string} source - Source node ID.
 * @property {string} target - Target node ID.
 * @property {string} type - Edge type (e.g., 'step', 'smoothstep').
 */

/**
 * @typedef {Object} FlowChartData
 * @property {FlowNode[]} nodes - All nodes in the chart.
 * @property {FlowEdge[]} edges - All connecting lines.
 */

/**
 * @typedef {Object} UserStats
 * @property {number} totalCommits - Total commits by user.
 * @property {Record<string, number>} languageDistribution - Key: language, Value: count.
 * @property {Record<string, number>} activityByDay - Key: weekday (e.g., "Mon"), Value: commits.
 * @property {number} starsReceived - Total stars across repos.
 * @property {number} forksReceived - Total forks across repos.
 **/
