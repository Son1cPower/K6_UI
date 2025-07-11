import { SharedArray } from "k6/data";

export function readJsonFromData(relativePath = "users") {
  return JSON.parse(open(`../data/${relativePath}.json`));
}

const userData = new SharedArray("users", function () {
  return readJsonFromData("users_PTF");
});

export function readRandomUserFromData() {
  return userData[Math.floor(Math.random() * userData.length)];
}