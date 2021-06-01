export class PSEMergerProvider {

    public static merger(...objs: any[]): any {
        objs = objs.filter(obj => obj !== undefined && obj !== null && obj.constructor === Object);
        const results = objs.reduce((result, obj) => { return { ...result, ...obj }; }, new Object());
        Object.keys(results).forEach(key => {
            const v1 = results[key];
            if (v1 !== undefined && v1 !== null && v1.constructor === Object) {
                const vs = [];
                for (let i = objs.length - 1; i >= 0; i--) {
                    if (key in objs[i]) {
                        const v2 = objs[i][key];
                        if (v2 !== undefined && v2 !== null && v2.constructor === Object) {
                            vs.push(v2);
                        } else {
                            break;
                        }
                    }
                }
                if (vs.length > 1) {
                    results[key] = PSEMergerProvider.merger(...vs);
                }
            }
        });
        return results;
    }

}
