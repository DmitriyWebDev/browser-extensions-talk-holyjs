console.log('{PAGE — START}');

const allowedClasses = ['a', 'b'];
const blackList = [
  {
    className: 'holy-example',
    extName: 'holyjs',
    remove: (element) => {
      element.parentNode.removeChild(element);
    },
  },
];

const sendAnalytics = ({ element, extension }) => {
  console.log('{PAGE EXTENSION DETECTED — START}');
  console.log(`Extension: ${extension.extName}`);
  //debugger;
  console.log(`Element: ${element.outerHTML}`);
  if (extension.remove) {
    extension.remove(element);
  }
  console.log('{PAGE EXTENSION DETECTED — END}');
};

const mo = new MutationObserver(function callback(mutationsList) {
  for (const mutation of mutationsList) {
    mutation.addedNodes.forEach((addedNode) => {
      if (addedNode.nodeType !== Node.ELEMENT_NODE) return false;
      const extension = blackList.find((item) => addedNode.classList.contains(item.className));
      if (extension) {
        sendAnalytics({ extension, element: addedNode });
        return;
      }
      if (['script', 'iframe'].includes(addedNode.tagName.toLowerCase())) {
        sendAnalytics({ extension: { extName: 'NEW SCRIPT OR IFRAME' }, element: addedNode });
        return;
      }
      if ([...addedNode.classList].some((className) => !allowedClasses.includes(className))) {
        sendAnalytics({ extension: { extName: 'NEW ELEMENT' }, element: addedNode });
        return;
      }
    });
  }
});

const config = {
  attributes: true,
  attributeOldValue: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true,
};
mo.observe(document, config);

console.log('{PAGE — END}');