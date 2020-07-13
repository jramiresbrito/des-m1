/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint no-unused-expressions: [2, { allowTernary: true }] */
// eslint-disable-next-line no-undef

/* Inicío das variáveis de estado da aplicação */
let users = [];
let searchedUsers = [];
let query = null;
let men = [];
let women = [];
let womenAgeCount = 0;
let menAgeCount = 0;
let input = null;
let list = null;
let statistics = null;
let usersHeader = null;
let btn = null;
/* Fim das variáveis de estado da aplicação */

window.addEventListener('load', () => {
  input = document.querySelector('#users-input');
  list = document.querySelector('#users-list');
  statistics = document.querySelector('#users-statistics');
  usersHeader = document.querySelector('#users-header');
  btn = document.querySelector('#search');
  numberFormat = Intl.NumberFormat('pt-BR');

  input.addEventListener('keyup', (event) => {
    query = event.target.value;

    if (event.key === 'Enter') {
      event.target.value === '' ? (searchedUsers = users) : searchUsers(query);
      setAppState();
      clearInput();
    }
  });

  btn.addEventListener('click', () => {
    query = input.value;
    query === '' ? (searchedUsers = users) : searchUsers(query);
    setAppState();
    clearInput();
  });

  fetchApi();
  input.focus();
});

const fetchApi = async () => {
  const request = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  users = await request.json();

  users = Array.from(users.results);

  users = users.map((user) => {
    return {
      name: `${user.name.first} ${user.name.last}`,
      gender: user.gender,
      age: user.dob.age,
      avatar: user.picture.medium,
    };
  });

  searchedUsers = users;

  setAppState();
};

const setAppState = () => {
  setStatistics();
  render();
};

const render = () => {
  renderUsers(searchedUsers);
  renderStatistics();
};

const filterByGenre = (usrs) => {
  men = usrs.filter((user) => user.gender === 'male');
  women = usrs.filter((user) => user.gender === 'female');

  men.sort((a, b) => a.name.localeCompare(b.name));
  women.sort((a, b) => a.name.localeCompare(b.name));
};

const sumAges = () => {
  womenAgeCount = women.reduce((acc, curr) => acc + curr.age, 0);
  menAgeCount = men.reduce((acc, curr) => acc + curr.age, 0);
};

const setStatistics = () => {
  filterByGenre(searchedUsers);
  sumAges();
};

const renderUsers = (usrs) => {
  let usersHTML = '<div>';

  usrs.forEach((user) => {
    const { avatar, name, age } = user;
    const userHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="mb-2">
          <img class="avatar" src="${avatar}" alt="${name}" />
        </div>
        <div>
          ${name}
        </div>
        <div>
          ${age} anos
        </div>
      </div>
    `;

    usersHTML += userHTML;
  });

  usersHTML += '</div>';

  list.innerHTML = usersHTML;
  usersHeader.innerText = `USUÁRIOS: (${searchedUsers.length})`;
};

const renderStatistics = () => {
  const statisticsHTML = `
    <p><strong>Homens: </strong>${men.length}</p>
    <p><strong>Mulheres: </strong>${women.length}</p>
    <p><strong>Soma das Idades: </strong>${formatNumber(
      womenAgeCount + menAgeCount
    )}</p>
    <p><strong>Média das Idades: </strong>${formatNumber(
      (womenAgeCount + menAgeCount) / searchedUsers.length
    )}</p>
  `;

  statistics.innerHTML = statisticsHTML;
};

const searchUsers = (queryString) => {
  searchedUsers = searchedUsers.filter((u) =>
    u.name.toLowerCase().includes(queryString.toLowerCase())
  );
};

const clearInput = () => {
  input.value = '';
  input.focus();
};

const formatNumber = (number) => numberFormat.format(number);
