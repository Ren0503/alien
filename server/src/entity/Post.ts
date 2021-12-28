import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    ManyToMany,
    OneToMany,
    JoinTable,
} from 'typeorm';

import { User } from './User';
import { Vote } from './Vote';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creatorId: number;

    @ManyToOne(() => User, (user) => user.posts)
    creator: User;

    @Column('varchar', { length: '200' })
    title: string;

    @Column('varchar')
    text: string;

    @Column({ type: 'int', default: 0 })
    points: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User, { cascade: ['remove'] })
    @JoinTable({ name: 'post_voters' })
    voter: User[];

    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];
}
