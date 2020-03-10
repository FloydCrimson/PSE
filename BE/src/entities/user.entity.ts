import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { SQLiteType } from '../common/types/sqlite.type';
import { RoleType } from '../common/types/role.type';

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    eid: number;

    @Column({ type: SQLiteType.TEXT, unique: true })
    email: string;

    @Column({ type: SQLiteType.TEXT, unique: true })
    nickname: string;

    @Column({ type: SQLiteType.TEXT })
    role: RoleType;

}
