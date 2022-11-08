const { createLobby } = require("../../endpoints/lobby/LobbyService")

beforeAll()  
test("LobbyCreate", async () => {
    createLobby({creator: 12345})
})