import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { Post } from "./Post";
import { Vote } from "./Vote";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: '200', unique: true })
    username: string;
  
    @Column('varchar', { length: '200', unique: true })
    email: string;
  
    @Column('varchar', { length: '200' })
    password: string;

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];
  
    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}
