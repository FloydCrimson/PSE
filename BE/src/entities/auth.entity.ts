import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { SQLiteType } from '../common/types/sqlite.type';
import { RoleType } from '../common/types/role.type';
import * as EI from '../entities.index';

@Entity()
export class AuthEntity {

    @PrimaryGeneratedColumn()
    eid: number;

    @Column({ type: SQLiteType.TEXT, unique: true })
    id: string;

    @Column({ type: SQLiteType.TEXT, unique: true })
    email: string;

    @Column({ type: SQLiteType.TEXT, unique: true })
    nickname: string;

    @Column({ type: SQLiteType.TEXT })
    key: string;

    @Column({ type: SQLiteType.TEXT })
    algorithm: 'sha1' | 'sha256';

    @Column({ type: SQLiteType.TEXT })
    role: RoleType;

    @Column({ type: SQLiteType.TEXT })
    status: 'no_auth' | 'auth' | 'blocked';

    @Column({ type: SQLiteType.INT, default: 0 })
    attempts: number;

    @Column({ type: SQLiteType.TEXT, nullable: true })
    first_login: string;

    @Column({ type: SQLiteType.TEXT, nullable: true })
    last_login: string;

    @OneToOne(entity => EI.UserEntity, { cascade: true, nullable: true })
    @JoinColumn()
    user: EI.UserEntity;

}
