// import route from "next-routes"
// export default route;
const routes = require("next-routes")();

routes
    .add("/campaigns/new", "/campaigns/new")
    .add("/campaigns/:address", "/campaigns/show")
    .add("/campaigns/:address/requests", "/campaigns/requests/index")
    .add("/campaigns/:address/requests/new", "/campaigns/requests/new")
    .add("/wallet", "/wallet/wallet");
//This is a wildcard or a variable, so it is indicated with a ":" at the beginning
//The second argument is the page to visit when called

module.exports = routes;
//using import was errored when testing
