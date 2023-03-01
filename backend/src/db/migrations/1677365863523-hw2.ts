import { MigrationInterface, QueryRunner } from "typeorm";

export class hw21677365863523 implements MigrationInterface {
    name = 'hw21677365863523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "match" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "picture" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "matcherId" integer, "matcheeId" integer, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_80e61381b28b6b6dd958c13be6d" FOREIGN KEY ("matcherId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_d5b0c1cdda6e33736477797ea70" FOREIGN KEY ("matcheeId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_d5b0c1cdda6e33736477797ea70"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_80e61381b28b6b6dd958c13be6d"`);
        await queryRunner.query(`DROP TABLE "match"`);
    }

}
