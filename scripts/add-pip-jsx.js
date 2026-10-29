const fs = require('fs');
const path = require('path');

const readerPath = path.join(process.cwd(), 'app', 'kid', '[childId]', 'read', '[storyId]', 'page.tsx');
let content = fs.readFileSync(readerPath, 'utf8');

// Find the main content div and add Pip companion floating on the side
const pipComponent = \`
          {/* Pip the Parrot Companion - Floating on right side */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <PipCompanion 
              childName={child.name} 
              isPaused={isTabPaused} 
              seeds={pipSeeds} 
              onFeed={() => setPipSeeds(s => Math.max(0, s - 1))} 
            />
          </div>
\`;

// Insert Pip before the closing </main> tag
if (!content.includes('Pip the Parrot Companion')) {
  content = content.replace(
    '</main>\n  );\n}',
    pipComponent + '\n    </main>\n  );\n}'
  );
  fs.writeFileSync(readerPath, content, 'utf8');
  console.log('Pip added to reader UI!');
} else {
  console.log('Pip already in reader UI');
}