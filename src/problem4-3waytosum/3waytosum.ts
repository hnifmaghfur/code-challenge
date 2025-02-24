// using simple for loop
function sum_to_n_a(n: number): number {let sum: number = 0;
    for(let i: number = 0; i <= n; i++){
        sum += i;
    }
    return sum;
}

// using Array.from and forEach
function sum_to_n_b(n: number): number {
    let sum: number = 0;
    Array.from({length: n + 1}, (_, i) => i).forEach(i => {
        sum += i;
    });
    return sum;
}

// using formula
function sum_to_n_c(n: number): number {
    return n * (n + 1) / 2;
}

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));