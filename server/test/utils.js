function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function loginWithAgent(agent, credential) {
  return new Promise((fulfill, reject) => {
    const data = {
      phone: credential.phone,
      // In the fixture, all credentials' phone numbers are their passwords
      password: credential.phone,
    };

    agent
        .post('/api/login/phone')
        .send(data)
        .expect(200)
        .end((err, _) => {
          if (err) reject(err);
          fulfill();
        });
  });
}

function signupWithAgent(agent, phone, password) {
  return new Promise((fulfill, reject) => {
    const data = {
      phone,
      password,
    };

    agent
        .post('/api/signup/phone')
        .send(data)
        .expect(200)
        .end((err, _) => {
          if (err) reject(err);
          else fulfill();
        });
  });
}

module.exports = {
  loginWithAgent,
  randomItem,
  signupWithAgent,
};