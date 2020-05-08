import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { SQLiteType } from '../common/types/sqlite.type';

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    eid: number;

    @Column({ type: SQLiteType.TEXT })
    firstname: string;

    @Column({ type: SQLiteType.TEXT })
    lastname: string;

}
