const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/app/(tab)/(home)/index.tsx',
    'src/app/(tab)/_layout.tsx',
    'src/app/(tab)/cart/_layout.tsx',
    'src/app/(tab)/cart/index.tsx',
    'src/app/(tab)/orders/_layout.tsx',
    'src/app/(tab)/orders/index.tsx',
    'src/app/(tab)/profile/_layout.tsx',
    'src/app/(tab)/profile/index.tsx',
    'src/app/+not-found.tsx',
    'src/app/_layout.tsx',
    'src/app/category/[type].tsx',
    'src/app/onboarding.tsx',
    'src/app/otp.tsx',
    'src/app/phone.tsx',
    'src/app/store/[id].tsx',
    'src/app/tracking/[id].tsx',
    'src/app/welcome.tsx',
    'src/components/CartFloatingBar.tsx',
    'src/components/ProductCard.tsx',
    'src/components/StoreCard.tsx'
];

filesToUpdate.forEach(filepath => {
    const fullPath = path.join(__dirname, '..', filepath);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${filepath} - not found`);
        return;
    }
    let content = fs.readFileSync(fullPath, 'utf8');

    // Skip if it doesn't import Colors
    if (!content.includes("import Colors from '@/constants/colors'")) {
        return;
    }

    // 1. Replace import
    content = content.replace(/import Colors from '@\/constants\/colors';?/g, "import { useTheme } from '@/hooks/use-theme';");

    // 2. Replace Colors. with colors.
    content = content.replace(/Colors\./g, "colors.");

    const hasStyles = content.includes('StyleSheet.create');

    // 3. Transform StyleSheet
    if (hasStyles) {
        content = content.replace(/const\s+styles\s*=\s*StyleSheet\.create\(/g, "const getStyles = (colors: any) => StyleSheet.create(");
    }

    // 4. Inject hooks into the default export component
    // We need to inject `const colors = useTheme();`
    // And if it has styles, `const styles = getStyles(colors);`

    const injection = hasStyles
        ? "\n  const colors = useTheme();\n  const styles = getStyles(colors);"
        : "\n  const colors = useTheme();";

    content = content.replace(/(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{|export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{|export\s+function\s+\w+\s*\([^)]*\)\s*\{|function\s+\w+\s*\([^)]*\)\s*\{)/, "$1" + injection);

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${filepath}`);
});
