'use strict'
import React from 'react'
import { Route, IndexRedirect, IndexRoute, Link } from 'react-router'

const RulePage = () => {
  return (
    <div className='rule-background'>
      <div id='gamerule'>
        <div className ='rule-content'>
        <h1 className ='rule-title-h1'><a id="OBJECT_OF_THE_GAME_0"></a>OBJECT OF THE GAME</h1>
        <p>Hot Spot: Fire Rescue is a cooperative game. All the players are on the same team and everyone either wins or loses together. To win, the players must rescue the victims trapped inside a burning building before the fire gets out of control or the building collapses.</p>
        <h1 className ='rule-title-h1'><a id="STARTING_THE_GAME_3"></a>STARTING THE GAME</h1>
        <p>First, you must sign up for an account by using either an email/password combination or your Google login credentials. Then you can choose or create a lobby to join. Once 2-6 players have joined the game, click the “Start Game” button.</p>
        <h2 className ='rule-title-h2'><a id="NOTES_ON_ADJACENT_SPACES_6"></a>NOTES ON ADJACENT SPACES</h2>
        <p>Any reference in the game to Adjacent spaces means those spaces that are up, down, left, or right from a space. Diagonal spaces are not Adjacent. Closed Doors and Walls prevent spaces from being Adjacent – unless the Wall segment is Destroyed. A Wall segment that is damaged twice is Destroyed. A Wall segment that is damaged once is Damaged.</p>
        <hr></hr>
        <h1 className ='rule-title-h1'><a id="GAME_TURNS_11"></a>GAME TURNS</h1>
        <p>Each player takes turns playing until the game ends.<br></br>
          There are three phases in each turn:</p>
        <ol>
          <li>
            <p>Take Action - The player can spend Action Points (AP) moving, fighting fires, chopping down walls, etc.</p>
          </li>
          <li>
            <p>Advance Fire - the game will add smoke on a random space</p>
          </li>
          <li>
            <p>Replenish POI markers - the game will add another POI if there are less than 3 on the board</p>
          </li>
        </ol>
        <h2 className ='rule-title-h2'><a id="1_Take_Action_21"></a>1) Take Action</h2>
        <p>A player gets 4 <strong>Action Points (AP)</strong> to spend on their turn. Each Action has a corresponding AP cost to perform. A player may select from any of the available Actions in any order and spend the appropriate AP to perform it. An action may be performed more than once per turn, so long as the AP cost is spent each time that Action is performed. Players may pass. Unspent AP are saved from turn to turn. A player may save a cumulative maximum of 4 AP at the end of their turn. Take an Action marker for each saved AP. On subsequent turns you may spend these Action markers as additional AP to perform Actions.</p>
        <h3 className ='rule-title-h3'><a id="ACTIONS_24"></a>ACTIONS</h3>
        <ul>
          <li>
            <p>Move – Move your Firefighter to an Adjacent space:</p>
            <ul>
              <li>Move to a space without Fire: 1 AP</li>
              <li>Move to a space with Fire: 2 AP</li>
              <li>Carry a Victim to an open Space or space with Smoke: 2 AP</li>
              <li>If you Move into a space with a POI marker, it will be revealed as either a Victim or a False Alarm. If you revealed a False Alarm it will be removed from the board. This will not count toward the total rescued victim count. Revealing a POI is a no cost (0AP) action.</li>
              <li>If you Carry a Victim outside of the building – Congratulations, you have just rescued them and it will count toward the 7 total rescued victims necessary to win the game. You may move through a Destroyed Wall. You may not Carry a Victim into a space with Fire. You may not end your turn on a space with Fire.</li>
            </ul>
          </li>
          <li>
            <p>Open/Close Door – Close or Open a Door in your space: 1 AP</p>
          </li>
          <li>
            <p>Extinguish – Use your gear to fight the fire in the Firefighter’s space or an Adjacent space:</p>
            <ul>
              <li>Remove a Smoke marker from the Board: 1 AP</li>
              <li>Extinguish  a Fire marker to Smoke: 1 AP</li>
              <li>Remove a Fire marker from the Board: 2 AP</li>
              <li>It is usually best to completely Extinguish Fire (2 AP); Smoke is liable to reignite.</li>
            </ul>
          </li>
          <li>
            <p>Chop – All Firefighters carry an axe. The axe is used to demolish walls, quickly reach trapped victims or create an escape route from the building.</p>
            <ul>
              <li>Place a Damage marker on a Wall segment in your space: 2 AP</li>
              <li>A Wall segment with two damage is Destroyed. Firefighters (and Fire) can pass through a Destroyed Wall segment as if that Wall was not there. Be careful, the building will collapse and kill everyone still in it if there are 24 damage in total to the walls.</li>
            </ul>
          </li>
        </ul>
        <h2 className ='rule-title-h2'><a id="2_Advance_Fire_44"></a>2) Advance Fire</h2>
        <p>After taking Actions, the player can press the “End Turn” button to move on to the Advance Fire phase. The game will randomly select a space inside the building to spread a smoke marker to.</p>
        <ul>
          <li><strong>If the Smoke is placed on an existing Smoke</strong> - the smoke will turn into a Fire.</li>
          <li><strong>If the Smoke is placed Adjacent to a Fire</strong> - the smoke will turn into a Fire. Remember: Smoke Adjacent to Fire = Fire.</li>
          <li><strong>If the Smoke is placed on an existing Fire</strong> – An Explosion will occur! Keep reading to see what happens.</li>
        </ul>
        <h3 className ='rule-title-h3'><a id="Explosions_51"></a>Explosions</h3>
        <p>When the fire Advances into a space that is already on Fire, an Explosion occurs. Explosions spread fire quickly, can damage walls or doors, Knock Down Firefighters and even kill Victims. An explosion radiates in all four directions (up, down, left, right) from the Target space. Any Wall(s) that borders the Target space will be Damaged. Any Door marker(s) that borders the Target space will be removed.</p>
        <p>If the Adjacent space in any direction is already on Fire, a Shockwave is created. The Shockwave continues to travel in its respective direction passing through all the spaces that are on Fire until it either encounters an Open space, Smoke filled space, Wall, or Closed Door. What happens with a Shockwave depends on what it hits first:</p>
        <ul>
          <li>Open Space (without Fire or Smoke) – A Fire will be placed on the Open Space, even if that space is outside of the building.</li>
          <li>Smoke Filled Space – The Smoke will be turned into Fire.</li>
          <li>Wall – The Wall will be Damaged. Remember a wall that has already been Damaged is Destroyed and will not stop a Shockwave.</li>
          <li>Closed Door – The Door will be Destroyed. This will not count toward the total damage count.</li>
          <li>A Shockwave travels through Destroyed Walls and Open Doors. If a Shockwave travels through an Open Door, that Door will be Destroyed.</li>
        </ul>
        <h4><a id="Secondary_Effects_62"></a>Secondary Effects</h4>
        <p>After the fire has Advanced and Explosions have been resolved, the game will check for additional effects.</p>
        <ul>
          <li>Flashover – Any Smoke marker in a space Adjacent to Fire will turn into Fire.</li>
          <li>Any Firefighters in a space with Fire are Knocked Down; keep reading to see what happens.</li>
          <li>Any Victims or POI in a space with Fire are Lost.</li>
        </ul>
        <h4><a id="Knocked_Down_69"></a>Knocked Down</h4>
        <p>A Firefighter is Knocked Down when Fire advances into their space; this could be from an explosion or being in a Smoke filled space that ignites. A Firefighter that is knocked down needs to go to the Ambulance to recover. When a Knock Down happens, the Firefighter will be moved to the closes Ambulance outside the building.</p>
        <p>If the Knocked Down Firefighter was carrying a Victim, that Victim is Lost.</p>
        <h2 className ='rule-title-h2'><a id="3_Replenish_POI_74"></a>3) Replenish POI</h2>
        <p>There will be 3 POI markers on the board (inside or outside of the building) at the end of every turn. If there are less than three, the game will randomly add a new POI marker(s) on the board. If the Target space has a Fire or Smoke marker, that Fire/Smoke marker will be removed before the POI is placed.</p>
        <h1 className ='rule-title-h1'><a id="GAME_END_77"></a>GAME END</h1>
        <p>The game ends when the building collapses, the players have won (7 Victims Rescued) or the players have been defeated (4+ Victims Lost).</p>
        <ul>
          <li>Building Collapse – The game ends immediately as the building collapses when 24 damage has been done to the walls.</li>
          <li>Victory – The players are victorious when seven Victims have been rescued.</li>
          <li>Defeat – The players are defeated when four or more Victims have been lost.</li>
        </ul>
        <h1 className ='rule-title-h1'><a id="You_are_now_ready_to_play_84"></a>You are now ready to play!</h1>
        </div>
      </div>
    </div>
  )
}

export default RulePage
