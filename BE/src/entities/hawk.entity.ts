import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { SQLiteType } from '../common/types/sqlite.type';
import * as EI from '../entities.index';

@Entity()
export class HawkEntity {

    @PrimaryGeneratedColumn()
    eid: number;

    @Column({ type: SQLiteType.TEXT, unique: true })
    id: string;

    @Column({ type: SQLiteType.TEXT })
    key: string;

    @Column({ type: SQLiteType.TEXT })
    algorithm: 'sha256' | 'sha1';

    @Column({ type: SQLiteType.TEXT })
    credentials: string;

    @Column({ type: SQLiteType.BOOLEAN })
    authenticated: boolean;

    @Column({ type: SQLiteType.INT })
    attempts: number;

    @OneToOne(entity => EI.UserEntity, { cascade: true })
    @JoinColumn()
    user: EI.UserEntity;

}
