import prisma from "../utils/prisma";
import JustDate from "../utils/justDate";

async function run() {
  const threshold = JustDate.todayUtc();
  threshold.subtractDays(3);

  return prisma.habitDay.deleteMany({
    where: {
      date: {
        lte: threshold.jsDateUtc(),
      }
    }
  });
}

run().then((deleted) => console.log(`Deleted ${deleted.count} HabitDays.`));

export default 0;
