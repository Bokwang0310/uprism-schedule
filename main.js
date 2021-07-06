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

const getCodeGetter = async () => {
  const path = "teacher.json";
  const codeObj = await fetch(path).then((res) => res.json());

  console.log(`Fetched ${path}`);
  return (teacher) => codeObj[teacher];
};

const getTodaySchedule = async (dayCode) => {
  const path = "myschedule.json";
  const scheduleObj = await fetch(path).then((res) => res.json());

  console.log(`Fetched ${path}`);
  return scheduleObj[convertDayCode(dayCode)];
};

async function main() {
  const todaySchedule = await getTodaySchedule(new Date().getDay());
  const getCode = await getCodeGetter();

  const a = todaySchedule.map(async ({ subject, teacher }, index) => {
    const textNode = document.createTextNode(
      `${index + 1}교시 ${subject}(${teacher}): `
    );

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
