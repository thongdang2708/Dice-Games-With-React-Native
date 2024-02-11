import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import uuid from 'react-native-uuid';

let board = [];
const NUMBER_OF_DICES_THROWS= 5;
const NUMBER_OF_DICES_FACES = 6;
const NUMBER_OF_THROWS = 4;
const STANDARD_TO_WIN =22;

export default function Gameboard() {

  

  const [numbersOfThrowsLeft, setNumbersOfThrowsLeft]= useState(NUMBER_OF_THROWS);
  const [numbersOfWins, setNumbersOfWins] = useState(0);
  const [gameConditions, setGameConditions] = useState("Game has not started");
  const [functionOfGames, setFunctionOfGames] = useState("Throw dices");
  const [rows, setRows] = useState([]);
  const [sum, setSum] = useState(0);
  const throwDices = () => {
    
    setSum(0);
    setRows([]);
    setGameConditions("Keep throwing dices");

    const newRows = [];
    let sum = 0;
    
    for (let i = 0; i < NUMBER_OF_DICES_THROWS; i++) {

      let randomNumber = Math.floor(Math.random() * NUMBER_OF_DICES_FACES + 1);
      
      newRows.push(<MaterialCommunityIcons
        name={"dice-" + randomNumber}
        key={uuid.v4()}
        size={50} 
        color={"steelblue"}>
      </MaterialCommunityIcons>);
      sum += randomNumber;
    }
    setRows(newRows);
    setNumbersOfThrowsLeft((number) => number - 1);

    if (sum === STANDARD_TO_WIN) {
      setNumbersOfWins((number) => number + 1);
    };
    setSum(sum);


  }

  useEffect(() => {
    if (numbersOfThrowsLeft === 0 && numbersOfWins > 0) {
      setGameConditions("You won!");
    } else if (numbersOfThrowsLeft === 0 && numbersOfWins === 0) {
      setGameConditions("Game over!");
    }
  
  },[numbersOfThrowsLeft, numbersOfWins]);

  const playAgain = () => {
    setNumbersOfThrowsLeft(NUMBER_OF_DICES_THROWS);
    setNumbersOfWins(0);
    setGameConditions("Game has not started");
    setFunctionOfGames("Throw dices");
    setRows([]);
    setSum(0);
  }

  
  return(
    <View style={styles.gameboard}>

        <View style={styles.flex}> 
          {rows}
        </View>
        <Text style={styles.gameinfo}> Sum: {sum} </Text>
        <Text style={styles.gameinfo}> Throws left: {numbersOfThrowsLeft} </Text>
        <Text style={styles.gameinfo}> Number of wins: {numbersOfWins} </Text>
        <Text style={styles.gameinfo}> {gameConditions} </Text>
        {numbersOfThrowsLeft !== 0 ? ( <Pressable onPress={() => throwDices()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}> {functionOfGames}</Text>
          </View>
        </Pressable>) : (
          <Pressable onPress={() => playAgain()}>
            <View style={styles.largeButton}>
            <Text style={styles.buttonText}> There are no turns to throw. Game Over! Please click to play again </Text>
            </View>
          </Pressable>
       
        )}
       
    </View>
  )
}