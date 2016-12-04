// var numbers = 1000;
// var sum = 0;

// for(var i = 0; i < numbers; i++) {
//     if(i % 3 === 0 || i % 5 === 0) {
//         sum += i;
//     }
// }

// console.log(sum);

// console.log('----------------------');
// sum = 2;
// var listOfValues = [1, 2]
// var lastTermValue = 4000000;
// var count = 1;
// var result = 2;
// var conta = '2';

// while (sum < lastTermValue) {
//     sum = listOfValues[count] + listOfValues[count -1];
//     if(sum < lastTermValue) {
//         if( sum % 2 === 0) {
//             result += sum;

//             conta = conta + ' + ' + sum;
//         };

//         listOfValues.push(sum);
//         count++;
//     }
// };

// console.log(listOfValues);
// console.log('A: ' + result);
// console.log(count+1);
// console.log(conta);

// console.log('----------------------');

const nums = [0,4,3,0]; 
const target = 10;

// let twoSum = function(nums, target) {
//     let arryReturn = [];
//     for(var i=0; i < nums.length; i++) {
//         arryReturn.push(i);
        
//         var xpto = nums.reduce(function(arr, current) {
//             const result = target - nums[i];
            
//             if(current === nums[i]) {
//                 return ([], arr);
//             }
            
//             if(result === current) {    
//                 return (arr.push(nums.indexOf(current)), arr);                 
//             } else {
//                 return (arr, arr);
//             }          
//         }, arryReturn);

//         if(arryReturn.length === 1) arryReturn = [];
//         if(arryReturn.length === 2) return arryReturn;
//     }
//     return arryReturn;    
// };


let twoSum = function(nums, target) {
    var arryReturn = [];
    for(var i=0; i < nums.length; i++) {
        for(var x=i+1; x< nums.length; x++) {
            const result = target - nums[i];
            if(result === nums[x]) {    
                arryReturn.push(i,x);              
            }
        }

        if(arryReturn.length > 0) return arryReturn;
    }
    return arryReturn;    
};

console.log(twoSum(nums, target));

// console.log('-------------------------------');
// let binary_search_iterative = function(a, key) {  
//   let low = 0;
//   let high = a.length - 1;
//   while (low <= high) {
//     let mid = low + Math.floor((high - low) / 2);
//     if (a[mid] === key) {
//       return mid;
//     }

//     if (key < a[mid]) {
//       high = mid - 1;
//     } else {
//       low = mid + 1;
//     }
//   }
  
//   return -1;
// };

// console.log(binary_search_iterative(nums, target));