import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/components/atoms/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/molecules/DataTable/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/molecules/InvoiceStatusBadge/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/molecules/MetricCard/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/molecules/SearchBar/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/molecules/UsageBar/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/organisms/EmptyState/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/organisms/PricingTierTable/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/organisms/SidebarNav/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/hooks/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
};
export default config;
