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

const getFullLink = (code) => `https://gne.uprism.io/join/${code}`;

const getClassCodeGetter = async () => {
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

const createAnchorElement = (innerText, attribute) => {
  const anchorElement = document.createElement("a");
  anchorElement.innerText = innerText;
  Object.entries(attribute).forEach((attr) => {
    anchorElement.setAttribute(...attr);
  });
  return anchorElement;
};

const appendAllChildren = (parentNode, ...children) =>
  children.map((child) => parentNode.appendChild(child));

const getLists = async (todaySchedule, getClassCode) =>
  todaySchedule.map(({ subject, teacher }, index) => {
    const textNode = document.createTextNode(
      `${index + 1}교시 ${subject}(${teacher}): `
    );

    const code = getClassCode(teacher);
    const anchorElement = createAnchorElement(code, {
      href: getFullLink(code),
      target: "_blank",
    });

    const listElement = document.createElement("li");
    appendAllChildren(listElement, textNode, anchorElement);

    return listElement;
  });

async function main() {
  const todaySchedule = await getTodaySchedule(new Date().getDay());
  const getClassCode = await getClassCodeGetter();

  const lists = await getLists(todaySchedule, getClassCode);

  const target = document.querySelector("ul");
  lists.map((list) => target.appendChild(list));
}

main();
