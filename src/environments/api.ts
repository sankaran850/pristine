import { environment } from "../environments/environment.prod";
export const AUTH_USERNAME = "PristineCompetitions";
export const AUTH_PASSWORD = "7b5fafa1c12072826389e59f2519dfd0";
export const REQUEST_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
};

let test = "live";

export const API =
  test === "live"
    ? "https://www.pristinecompetitions.co.uk/API/api-v.2.0.5.php"
    : "http://vv5/first/dionne/pristine/API/api.v.2.0.6.php";

export const CHECKOUT =
  test === "live"
    ? "https://www.pristinecompetitions.co.uk/app-redirect.php"
    : "https://www.pristinecompetitions.co.uk/demo/app-redirect.php";
