export default class Client {
  constructor(key) {
    this.key = key;
    // global server 2: https://db.fauna-dev.com/query/1
    // US-East: https://us-dev.db.faunadb.net/query/1
    this.url = process.env.NEXT_PUBLIC_FAUNA_URL || 'https://db.fauna.com/query/1';
    // `https://db.fauna-dev.com/query/1`;
  }

  _getKey() {
    return this.key;
  }

  _getUrl() {
    return this.url;
  }

  async query(fql_expression) {
    if (!this.key) {
      return "Please provide a valid key";
    }
    return fetch(this.url, {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${this.key}`,
        "x-format": "simple",
        "x-typecheck": "false"
      },
      body: JSON.stringify({
        query: fql_expression,
        arguments: {},
      }),
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        return data.data;
      })
      .catch((e) => console.log("ERROR ===>>>", e));
  }
}