import firebase from 'APP/fire'

export const sendPlayersToFirebase= (id, ap, location, color) => (
  firebase.database().ref('/board1/players').set({
    id: id,
    ap: ap,
    location: location,
    color: color
  })
)
// [
//   [0, 6, 'blue'],
//   [1, 30, 'green'],
//   [2, 73, 'purple'],
//   [3, 49, 'orange']]
export const loadPlayers=[]

let ref=firebase.database().ref('/board1/players')
ref.on('value', function(snapshot) {
  loadPlayers.push(snapshot.val())
})

export const loadBoards=[]
export const sendBoardToFirebase = (id) => {
  firebase.database().ref(`/boards/board${id}`).set({
    id: id,
    name: `Board${id}`
  })
  firebase.database().ref(`/boards/board${id}`).on('value', function(snapshot) {
    loadBoards.push(snapshot.val())
  })
}
