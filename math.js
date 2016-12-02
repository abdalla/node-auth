var numbers = 1000;
var sum = 0;

for(var i = 0; i < numbers; i++) {
    if(i % 3 === 0 || i % 5 === 0) {
        sum += i;
    }
}

console.log(sum);

console.log('----------------------');
sum = 2;
var listOfValues = [1, 2]
var lastTermValue = 4000000;
var count = 1;
var result = 2;
var conta = '2';

while (sum < lastTermValue) {
    sum = listOfValues[count] + listOfValues[count -1];
    if(sum < lastTermValue) {
        if( sum % 2 === 0) {
            result += sum;

            conta = conta + ' + ' + sum;
        };

        listOfValues.push(sum);
        count++;
    }
};

console.log(listOfValues);
console.log('A: ' + result);
console.log(count+1);
console.log(conta);