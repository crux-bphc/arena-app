const send = (e, name) => {
  const res = $http.send({
    url: `${process.env.INTERNAL_PB_URL}/api/collection/${name}`,
    method: "POST",
    body: JSON.stringify(e.record),
    headers: { "content-type": "application/json" },
  });
  if (res.statusCode != 200) {
    if (res.statusCode == 400)
      throw new BadRequestError(
        `Failed to ${name} record! ${res.json.message}`
      );
    // Will always be a 500?
    else
      throw new BadRequestError(
        `${res.statusCode}: Failed to ${name} record! ${res.json.message}`
      );
  }
  e.next();
};

module.exports = {
  send,
};
