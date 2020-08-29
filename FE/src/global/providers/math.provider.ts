export class MathProvider {

    public static getPrimeSequence(length: number): number[] {

        const exp_max = 1.0807958013187289; // offset_array length upper bound

        if (length <= 0)
            throw new Error('"length" is not positive.');
        if (length == 1)
            return [2];
        if (length == 2)
            return [2, 3];
        if (length == 3)
            return [2, 3, 5];

        const prime_array = new Array<number>(length);
        prime_array[0] = 2;
        prime_array[1] = 3;
        prime_array[2] = 5;
        let count_prime = 3;
        let index_prime_start = 2;

        const offset_array = new Array<number>(Math.floor(Math.pow(prime_array.length, exp_max)));
        offset_array[0] = 1;
        offset_array[1] = 5;
        let count_offset = 2;
        let index_offset_end = 2;

        let primorial = 6;
        let increment = 6;
        while (true) {
            for (let cycle = 1; cycle < prime_array[index_prime_start]; cycle++, primorial += increment) {
                for (let index_offset = 0; index_offset < index_offset_end; index_offset++) {
                    let prime = primorial + offset_array[index_offset];
                    let sqrt = Math.floor(Math.sqrt(prime)) + 1;
                    let check_prime = true;
                    for (let index_prime = index_prime_start; prime_array[index_prime] < sqrt; index_prime++)
                        if (prime % prime_array[index_prime] == 0) {
                            check_prime = false;
                            break;
                        }
                    if (check_prime) {
                        prime_array[count_prime++] = prime;
                        if (count_prime == prime_array.length)
                            return prime_array;
                    }
                    offset_array[count_offset++] = prime;
                }
            }
            let offset = 0;
            for (let index_offset = 0; index_offset < count_offset; index_offset++) {
                if (offset > 0)
                    offset_array[index_offset - offset] = offset_array[index_offset];
                if (offset_array[index_offset] % prime_array[index_prime_start] == 0)
                    offset++;
            }
            count_offset -= offset;
            index_prime_start++;
            index_offset_end = count_offset;
            increment = primorial;
        }
    }

}
