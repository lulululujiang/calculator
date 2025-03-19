class Node{
    constructor(val=null,left=null,right=null){
        this.val=val;
        this.left=left;
        this.right=right;
    }
}

function getPrecedence(operator){
    if (operator === '+' || operator === '-') {
        return 1;
      } else if (operator === '*' || operator === '/') {
        return 2;
      }
      return 0;
}

function isOperator(char){
    return ['+', '-', '*', '/'].includes(char);
}

function infixToPostfix(expression){
    const result=[];
    const stack=[];
    let i=0;

    while(i<expression.length){
        let char=expression[i];
        if(/[0-9.]/.test(char)){
            let numBegin=i;
            while(i<expression.length && /[0-9.]/.test(expression[i])){
                i++;
            }
            result.push(expression.slice(numBegin,i));
            continue;
        }
        if(char=='('){
            stack.push(char);
        }
        else if(char==')'){
            while(stack.length && stack[stack.length-1]!=='('){
                result.push(stack.pop());
            }
            stack.pop();
        }
        else if(isOperator(char)){
            while(stack.length && stack[stack.length-1]!=='(' && getPrecedence(stack[stack.length-1]) >= getPrecedence(char)){
                result.push(stack.pop());
            }
            stack.push(char);
        }
        i++;
    }
    while(stack.length){
        result.push(stack.pop());
    }
    return result;
}

function buildExpressionTree(postfix){
    const stack=[];
    for(let i=0;i<postfix.length;i++){
        if(isOperator(postfix[i])){
            if(stack.length<2)throw new Error("Invaild expression");
            const right =stack.pop();
            const left=stack.pop();
            const node=new Node(postfix[i],left,right);
            stack.push(node);
        }
        else{
            stack.push(new Node(postfix[i]));
        }
    }
    if (stack.length !== 1) throw new Error("Invalid expression");
    return stack.pop();
}

function evaluateExpressionTree(node){
    if(!node.left && !node.right){
        return parseFloat(node.val);
    }
    let leftVal =evaluateExpressionTree(node.left);
    let rightVal=evaluateExpressionTree(node.right);

    switch(node.val){
        case'+': return leftVal+rightVal;
        case '-':return leftVal-rightVal;
        case '*':return leftVal*rightVal;
        case '/':return leftVal/rightVal;
        default:return 0;
    }
}

function evaluateExpression(expression){
    const postfix=infixToPostfix(expression);
    const expressionTree=buildExpressionTree(postfix);
    return evaluateExpressionTree(expressionTree);
}

const equalsButton=document.querySelector(".equals");
equalsButton.addEventListener('click', () => {
    try {
        const expression=data.displayString;
        const postfix = infixToPostfix(expression);
        const expressionTree = buildExpressionTree(postfix);
        const result = evaluateExpressionTree(expressionTree);
        data.displayString = result.toString();
        data.updateDisplay();
    } 
    catch (error) {
        data.displayString = "Error";
        data.updateDisplay();
    }
});

const decimalButton=document.querySelector('.decimal');
decimalButton.addEventListener('click',()=>{
    const lastChar=data.displayString.slice(-1);
    if(/[0-9]/.test(lastChar)){
        let i=data.displayString.length-1;
        while(i>=0 && /[0-9.]/.test(data.displayString[i])){
            if(data.displayString[i]=='.'){
                return;
            }
            i--;
        }
        data.displayString += '.';
    }
    else if(data.displayString==="0"){
        data.displayString="0.";
    }
    data.updateDisplay();
});

document.querySelector(".clear").addEventListener("click", () => {
    data.displayString = "0";
    data.updateDisplay();
  });
  

const originalAppendStringNum = data.appendStringNum||function(){};
data.appendStringNum = (newChar) => {
  if (newChar === ".") {
    let i = data.displayString.length - 1;
    let hasDecimal = false;
    while (i >= 0 && /[0-9.]/.test(data.displayString[i])) {
      if (data.displayString[i] === '.') {
        hasDecimal = true;
        break;
      }
      i--;
    }
    if (!hasDecimal) {
      data.displayString += (/[0-9]/.test(data.displayString.slice(-1))) ? "." : "0.";
    }
  } else {
    originalAppendStringNum(newChar);
  }
  data.updateDisplay();
};