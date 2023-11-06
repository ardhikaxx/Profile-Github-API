import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

type GitHubUserData = {
  login: string;
  avatar_url: string;
  public_repos: number;
};

type GitHubLanguages = {
  [key: string]: number;
};

function App() {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [languages, setLanguages] = useState<GitHubLanguages | null>();

  useEffect(() => {
    const githubUsername = 'ardhikaxx';
    const githubApiUrl = `https://api.github.com/users/${githubUsername}`;
    const githubReposUrl = `https://api.github.com/users/${githubUsername}/repos`;

    axios.get(githubApiUrl).then((response) => {
      setUserData(response.data);
    });

    axios.get(githubReposUrl).then((reposResponse) => {
      const reposData = reposResponse.data;

      const languagesCount: GitHubLanguages = {};

      reposData.forEach((repo: any) => {
        if (repo.language) {
          if (languagesCount[repo.language]) {
            languagesCount[repo.language] += 1;
          } else {
            languagesCount[repo.language] = 1;
          }
        }
      });

      setLanguages(languagesCount);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {userData && (
          <div className="profile-card">
            <img src={userData.avatar_url} alt={`${userData.login}'s Profile`} />
            <h2>{userData.login}</h2>
            <p>Repositories: {userData.public_repos}</p>
            {languages && (
              <div className="languages-list">
                {Object.keys(languages).map((language) => (
                  <div key={language} className="language-item">
                    <p>{language}</p>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{
                          width: `${((languages[language] / userData.public_repos) * 100).toFixed(2)}%`,
                        }}
                      ></div>
                    </div>
                    <p>
                      {((languages[language] / userData.public_repos) * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;