import { graphql } from "@octokit/graphql";
import dotenv from "dotenv";
dotenv.config({ path: "SECRETS.env" });

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

export async function fetchUserData(
  username: string,
  callback: (userData: object) => void
) {
  const now = new Date().toISOString();
  let lastYearMS = Date.now() - 31556952000;
  const lastYear = new Date(lastYearMS).toISOString();

  try {
    let data: object = await graphqlWithAuth({
      query: `query {
                user(login: "${username}") {
                    repositories(last: 100) {
                        totalCount
                        nodes {
                        name
                        stargazerCount
                        visibility
                        languages(first: 100) {
                            nodes {
                              name
                            }
                          }
                        }
                    }
                    createdAt
                    contributionsCollection(
                        from: "${lastYear}"
                        to: "${now}"
                    ) {
                        contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                            weekday
                            date
                            contributionCount
                            color
                            }
                            firstDay
                        }
                        }
                    }
                }
            }`,
    });

    callback(data);
  } catch (err) {
    console.error(err);
    return;
  }
}

export function getLanguages(data: any) {
  let _languages: any = {};
  let total = 0;
  let repos = data.user.repositories.nodes;
  repos.forEach((repo: any) => {
    let languages = repo.languages.nodes;
    languages.forEach((language: any) => {
      if (_languages.hasOwnProperty(language.name)) {
        _languages[language.name] += 1;
      } else {
        _languages[language.name] = 1;
      }
      total++;
    });
  });

  return { total: total, languages: _languages };
}
