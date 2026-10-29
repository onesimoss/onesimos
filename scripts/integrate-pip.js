const fs = require('fs');
const path = require('path');

const readerPath = path.join(process.cwd(), 'app', 'kid', '[childId]', 'read', '[storyId]', 'page.tsx');
let content = fs.readFileSync(readerPath, 'utf8');

// Add PipCompanion import
if (!content.includes('PipCompanion')) {
  content = content.replace(
    'import ReadAloudMic from "@/components/ReadAloudMic";',
    'import ReadAloudMic from "@/components/ReadAloudMic";\nimport PipCompanion from "@/components/PipCompanion";'
  );
}

// Add pipSeeds state
if (!content.includes('pipSeeds')) {
  content = content.replace(
    'const [isTabPaused, setIsTabPaused] = useState(false);',
    'const [isTabPaused, setIsTabPaused] = useState(false);\n  const [pipSeeds, setPipSeeds] = useState(0);'
  );
}

// Add seed earning on mic result
if (!content.includes('setPipSeeds')) {
  content = content.replace(
    'result.stumbled.forEach((word) => {',
    'setPipSeeds(s => s + 1);\n      result.stumbled.forEach((word) => {'
  );
}

fs.writeFileSync(readerPath, content, 'utf8');
console.log('Reader page updated with Pip integration');