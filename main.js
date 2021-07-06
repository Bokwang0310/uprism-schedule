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

    // TODO: Handle
    default:
      return 0;
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
  const path = "schedule.json";
  const scheduleObj = await fetch(path).then((res) => res.json());

  console.log(`Fetched ${path}`);
  return scheduleObj[convertDayCode(dayCode)];
};

const createAnchorElement = (href, text) => {
  const anchorElement = document.createElement("a");
  anchorElement.setAttribute("href", href);
  anchorElement.innerText = text;

  return anchorElement;
};

const appendAllChildren = (parentNode, ...children) =>
  children.map((child) => parentNode.appendChild(child));

const createLinkElement = (code) => createAnchorElement(getLink(code), code);

const getLists = async (todaySchedule, getCode) =>
  todaySchedule.map(({ subject, teacher }, index) => {
    const textNode = document.createTextNode(
      `${index + 1}교시 ${subject}(${teacher}): `
    );
    const anchorElement = createLinkElement(getCode(teacher));

    const listElement = document.createElement("li");
    appendAllChildren(listElement, textNode, anchorElement);

    return listElement;
  });

async function main() {
  const todaySchedule = await getTodaySchedule(new Date().getDay());
  const getCode = await getCodeGetter();

  const lists = await getLists(todaySchedule, getCode);

  const target = document.querySelector("ul");
  lists.map((list) => target.appendChild(list));
}

main();
