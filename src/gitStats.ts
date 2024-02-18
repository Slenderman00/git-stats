import { graphql } from "@octokit/graphql";
import dotenv from "dotenv";
dotenv.config({ path: 'SECRETS.env' })

const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    }
})

export async function fetchUserData(username: string, callback: (userData: object) => void) {
    const now = new Date().toISOString();
    let lastYearMS = Date.now() - 31556952000;
    const lastYear = new Date(lastYearMS).toISOString();

    console.log(now)

    let data: object = await graphqlWithAuth({
        "query": `query {
            user(login: "${username}") {
              repositories(last: 100) {
                totalCount
                nodes {
                   name
                   stargazerCount
                   visibility
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
          }`
    })

    callback(data)
}