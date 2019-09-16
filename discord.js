const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('./utils');

const CLIENT_ID = "613352027820523520";
const CLIENT_SECRET = "QDd2AWl8BXQeKZaa2zYPgvyC1feyS2zG";
const redirect = encodeURIComponent('http://lav.dev.yoctu.ovh/discord/callback');

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  const json = await response.json();
  res.redirect(`/game?token=${json.access_token}`);
}));

module.exports = router;
