const convertDayCode = (dayCode) => {
  switch (dayCode) {
    case 1:
      return 0;

    case 2:
      return 1;

    case 3:
      return 2;

    case 4:
      return 3;

    case 5:
      return 4;

    default:
      return -1;
  }
};

const getLink = (code) => `https://gne.uprism.io/join/${code}`;

async function* codeGenerator() {
  const codeObj = await fetch("teacher.json").then((res) => res.json());
  console.log("Fetched teacher.json");
  while (true) {
    yield (teacher) => codeObj[teacher];
  }
}
async function test() {
  const codeObj = await fetch("teacher.json").then((res) => res.json());
  console.log("Fetched teacher.json");
  return (teacher) => codeObj[teacher];
}

async function main() {
  const schedule = await fetch("myschedule.json").then((res) => res.json());
  const todaySchedule = schedule[convertDayCode(new Date().getDay())];
  const gen = codeGenerator();

  const a = todaySchedule.map(async ({ subject, teacher }, index) => {
    const textNode = document.createTextNode(
      `${index + 1}교시 ${subject}(${teacher}): `
    );

    const getCode = (await gen.next()).value;
    const code = getCode(teacher);
    const link = getLink(code);

    const anchorElement = document.createElement("a");
    anchorElement.setAttribute("href", link);
    anchorElement.innerText = code;

    const listElement = document.createElement("li");
    listElement.appendChild(textNode);
    listElement.appendChild(anchorElement);

    return listElement;
  });

  console.log(a);

  const target = document.querySelector("div");
  a.map(async (b) => target.appendChild(await b));
}

main();
