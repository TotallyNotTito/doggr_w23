/** @module Models/Match*/
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation
} from "typeorm";

import {User} from "./user";
import {Profile} from "./profile"

/**
 * Profile match - This is for match with the profile table
 * Each profile corresponds to exactly 1 pet owned by a User.
 * This allows each user to have many pet profiles without needing to create more accounts
 */
@Entity()
export class Match extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	picture: string;

    //Matcher
	@ManyToOne((type) => Profile, (p: Profile) => p.matchers, {

        cascade: true,

        onDelete: "CASCADE"
	})
	matcher: Relation<Profile>;

    //Matchee
    @ManyToOne((type) => Profile, (p: Profile) => p.matchees, {

        cascade: true,

        onDelete: "CASCADE"
	})
	matchee: Relation<Profile>;

	//Attempt at Bonus Messaages
	@ManyToOne((type) => Profile, (p: Profile) => p.user)
	messages: Relation<Profile[]>;

	@CreateDateColumn()
	created_at: string;
}



/*
TINDER: you are profile1
when you swipe-right on another profile, say profile2
> Create a new Match row in the Match table and set its matching_profile to our user

if someone else swipes right on YOUR profile, again, profile1
> Create a new match row in the match table and set its matched_Profile to our user

 */
