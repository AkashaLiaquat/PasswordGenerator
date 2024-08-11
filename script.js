const inputSlider=document.querySelector('[data-lengthSlider]');
const lengthDisplay=document.querySelector('[data-lengthNumber]');
const passwordDisplay=document.querySelector('[data-passwordDisplay]');
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copyMsg]');
const upperCaseCheck=document.querySelector('#upperCase');
const lowerCaseCheck=document.querySelector('#lowerCase');
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const indicator=document.querySelector('[data-indicator]');
const generateBtn=document.querySelector('.generateButton');
const allCheckBox=document.querySelectorAll("input[type=checkbox]");//array
const symbols = '~`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?*#';

//Initially
let password="";
let passwordLength=10;
let checkCount=0;
setIndicator("#ccc");//initially grey
handleSlider();
//Set Password Length
function handleSlider (){
  inputSlider.value=passwordLength;//initially 10
  lengthDisplay.innerText=passwordLength;
  /*slider color */
//  const min = inputSlider.min;
    const max = inputSlider.max;//20
    inputSlider.style.backgroundSize = ( (passwordLength)*100/(max)) + "% 100%";// "20% 100%" means 20% width & 100% height
}

function setIndicator(color){
  indicator.style.backgroundColor= color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndmInteger(min,max) {
  //let max=10 min=5
 let randomNumber=Math.random();//random b/w 0 and 1
 let range0to5=randomNumber * (max - min);//b/w 0 and 5 depending on random number
 let floorValue=Math.floor(range0to5);//to eliminate decimal
 let range5to10=floorValue + min;
 /* ager hum directly max pay apply ker dety to 0 to 9 answer ata
 isi lye pehly humny 0 to min range nikali phir min add kia...min bad
 main add is lye kya taky resulting number 5 ya 5 sy uper ho for sure */
 //OR
 //Math.floor(Math.random() * max) % (max - min) + min;
 return range5to10;
}

function generateRndmNumber(){
  return getRndmInteger(0,9);
}

//a=97 z=122 ASCII
function generateRndmLowerCase(){
 return String.fromCharCode(getRndmInteger(97,122));//returns string from character code
}

//A=65 Z=90
function generateRndmUpperCase(){
  return String.fromCharCode(getRndmInteger(65,90));
}

function generateRndmSymbol(){
 const randomIndex=getRndmInteger(0,symbols.length);
//  return symbols.charAt(randomIndex);
//OR
return symbols[randomIndex];
}

function calcStrength(){
  let hasUpper=false;//initially
  let hasLower=false;
  let hasNumber=false;
  let hasSymbol=false;

  if(upperCaseCheck.checked) hasUpper=true;//if check box of upper case checked then true
  if(lowerCaseCheck.checked) hasLower=true;
  if(numbersCheck.checked) hasNumber=true;
  if(symbolsCheck.checked) hasSymbol=true;

  if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8){
    setIndicator('#0f0');
  }

  else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6){
    setIndicator('#ff0');
  }
  else{
    setIndicator('#f00');
  }
}

async function copyContent(){
 try{
  //as passWord is input field so it will have value not innerText
  await navigator.clipboard.writeText(passwordDisplay.value);//generated password
  //innerText only input after the await line stops executing
  copyMsg.innerText="copied";/*added innerText but initially invisible */
 }
 catch(e){//if caught an error
  copyMsg.innerText="Failed";
 }
 //initially invisible span now made visible by adding active named class
 copyMsg.classList.add("active")
 //2 sec baad remove so that dubara invisible ho jaye
 setTimeout(()=>{copyMsg.classList.remove("active")},2000);
}

function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach((checkBox)=>{
    if(checkBox.checked)
      checkCount++;
  });
  //special Condition
  if(passwordLength<checkCount){
    passwordLength=checkCount;//update slider value and length display
    handleSlider();
  }
}

allCheckBox.forEach((checkBoxx)=>{
  //any change then checkBox dubara sy count ker kay checkCount update kro
  checkBoxx.addEventListener('change',handleCheckBoxChange);
});

function shufflePassword(array) {
  // Fisher-Yates Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  //convert array back to string
  let str="";
  array.forEach(letter=>str+=letter);
  return str;
}


inputSlider.addEventListener('input',(eventt)=>{
 /*Update passwordLength variable */
  passwordLength=eventt.target.value;//input value of slider
  handleSlider();//to update lengthDisplay
});

copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value)//true if non-empty OR USE password.length>0
    {
   copyContent();
  }
})

generateBtn.addEventListener('click', ()=>{
  if (checkCount==0){
   return;
  }
  if (passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();//update slider value and length display
  }
  //Generate new password
  // password="";
  // if (upperCaseCheck.checked){
  //   password+=generateRndmUpperCase();
  // }
  // if (lowerCaseCheck.checked){
  //   password+=generateRndmLowerCase();
  // }
  // if (numbersCheck.checked){
  //   password+=generateRndmNumber();
  // }
  // if (symbolsCheck.checked){
  //   password+=generateRndmSymbol();
  // };
  let functionArr=[];
  password="";
  if (upperCaseCheck.checked){
    functionArr.push(generateRndmUpperCase);//returning function reference stored to index
  }
  if (lowerCaseCheck.checked){
    functionArr.push(generateRndmLowerCase);
  }
  if (numbersCheck.checked){
    functionArr.push(generateRndmNumber);
  }
  if (symbolsCheck.checked){
    functionArr.push(generateRndmSymbol);
  }
  
  //Compulsory Addition
  functionArr.forEach(func => {
    password += func(); // Call the function to get a character
  });

 // Remaining Addition
 while (password.length < passwordLength) //while generated password length < than passwordLength set by user   OR
 //(passwordLength-functionArr.length >0)
  {
    // Pick a random index of functionArr
  //const randomResult = functionArr[getRndmInteger(0, functionArr.length)];//range of funcArr will be 0 to maximumly 4
  //password += randomResult(); // Call the function to get a character
 password+= functionArr[getRndmInteger(0,functionArr.length)]();//function[function at random index]()called
}

// Shuffle password
password = shufflePassword(Array.from(password));

// Show in UI
passwordDisplay.value = password;
// Calculate strength indicator
calcStrength();
});