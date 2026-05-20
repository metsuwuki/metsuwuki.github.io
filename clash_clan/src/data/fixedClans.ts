import ukraineImage from "../../assets/Ukraine.png";
import raybojnikiImage from "../../assets/Raybojniki.png";
import type { ClanKey, ClanRecord, PlayerRole } from "../types";

export const fixedClans: ClanRecord[] = [
  {
    key: "ukraine",
    name: "!!!Ukraine!!!",
    image: ukraineImage
  },
  {
    key: "raybojniki",
    name: "РАЗБОЙНИКИ",
    image: raybojnikiImage
  }
];

export const playerRoleLabels: Record<PlayerRole, string> = {
  leader: "Глава",
  coLeader: "Соруководитель",
  member: "Участник"
};

export const playerRoleOrder: Record<PlayerRole, number> = {
  leader: 0,
  coLeader: 1,
  member: 2
};

export function getFixedClan(clanKey: ClanKey): ClanRecord {
  return fixedClans.find((clan) => clan.key === clanKey) ?? fixedClans[0];
}
