// Dynamically import the fetch function
async function loadFetch() {
  const { default: fetch } = await import('node-fetch');
  return fetch;
}

const clientHost = '';
const clientContext = '/send-message';

async function informTO(message) {
  const fetch = await loadFetch(); // Load fetch dynamically
  const url = `https://fe0vlbj3y5.execute-api.ap-southeast-1.amazonaws.com/default/cps-lambda`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.text();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  informTO,
};
