db.createUser({
  user: 'foodAdmin',
  pwd: 'G%1r#$G8bJynAmGifzsQilNsbrula*',
  roles: [{ role: 'dbOwner', db: 'food' }],
});

db.auth('admin', 'sGpujmN9RRt^fcvn4gaAK@VU*KqN#cKz9A1J29g9P1');
db.createUser({
  user: 'admin',
  pwd: 'sGpujmN9RRt^fcvn4gaAK@VU*KqN#cKz9A1J29g9P1',
  roles: [{ role: 'root', db: 'admin' }],
});
