export class PasswordCheckerProvider {

    public static getPasswordChecker(sets: string[] = [], oset?: string, flags?: string, min: number = 1, max?: number): RegExp {
        if (min < 1) {
            throw '"min" must be >=1';
        }
        if (max !== undefined && max < min) {
            throw '"max" must be >="min"';
        }
        let regExp = '';
        regExp += '^';
        if (sets.length > 0) {
            regExp += sets.map((set) => '(?=.*[' + set + '])').join('');
            regExp += '[' + sets.map((set) => set).join('') + (oset !== undefined ? oset : '') + ']';
        } else {
            regExp += (oset !== undefined ? oset : '.');
        }
        regExp += '{' + min + ',' + (max !== undefined ? max : '') + '}';
        regExp += '$';
        return new RegExp(regExp, flags);
    }

}
