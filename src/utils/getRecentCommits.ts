import fs from 'node:fs';
import path from 'node:path';

export interface RecentCommit {
  repo: string;
  message: string;
  sha: string;
  url: string;
  date: string;
  timestamp: number;
}

function getToken(): string {
  if (typeof process !== 'undefined' && process.env && process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN.trim();
  }
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && typeof metaEnv === 'object' && metaEnv.GITHUB_TOKEN) {
      return String(metaEnv.GITHUB_TOKEN).trim();
    }
  } catch {}
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^\s*GITHUB_TOKEN\s*=\s*(?:["']?)(.*?)(?:["']?)\s*$/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch {}
  return '';
}

function formatCommitDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export async function getRecentCommits(): Promise<RecentCommit[]> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "sohamsangole-portfolio-build",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
  }

  try {
    // Dynamically fetch recently pushed repos from GitHub
    const reposEndpoint = token
      ? "https://api.github.com/user/repos?sort=pushed&per_page=6&affiliation=owner"
      : "https://api.github.com/users/sohamsangole/repos?sort=pushed&per_page=6";

    let reposRes = await fetch(reposEndpoint, { headers });

    // If token request fails (e.g. 401 bad token), fallback to public repos
    if (!reposRes.ok && token) {
      delete headers["Authorization"];
      reposRes = await fetch("https://api.github.com/users/sohamsangole/repos?sort=pushed&per_page=6", { headers });
    }

    let targetRepos: any[] = [];
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      if (Array.isArray(reposData)) {
        targetRepos = reposData.slice(0, 4);
      }
    }

    if (targetRepos.length === 0) {
      return [];
    }

    // Fetch latest commits for each dynamic repository
    const commitPromises = targetRepos.map(async (repo: any) => {
      try {
        const fullRepo = repo.full_name || `sohamsangole/${repo.name}`;
        const res = await fetch(`https://api.github.com/repos/${fullRepo}/commits?per_page=4`, { headers });
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map((c: any) => ({
          repo: repo.name || fullRepo.replace(/^sohamsangole\//i, ""),
          message: (c.commit?.message || "").split("\n")[0].trim() || `Commit ${c.sha?.substring(0, 7)}`,
          sha: (c.sha || "").substring(0, 7),
          url: c.html_url || `https://github.com/${fullRepo}/commit/${c.sha}`,
          date: formatCommitDate(c.commit?.author?.date || c.commit?.committer?.date),
          timestamp: new Date(c.commit?.author?.date || c.commit?.committer?.date || 0).getTime(),
        }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(commitPromises);
    const allCommits = results.flat().filter((c) => c.sha && c.message);

    allCommits.sort((a, b) => b.timestamp - a.timestamp);
    return allCommits.slice(0, 4);
  } catch {
    return [];
  }
}
