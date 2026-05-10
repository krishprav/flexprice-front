import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, PanelLeftClose, PanelLeft, type LucideIcon } from 'lucide-react';

interface NavSubItem {
	/** Label for the sub-item */
	label: string;
	/** Route path or identifier */
	href: string;
	/** Optional icon */
	icon?: LucideIcon;
}

interface NavItemConfig {
	/** Label for the nav item */
	label: string;
	/** Route path or identifier */
	href: string;
	/** Lucide icon component */
	icon: LucideIcon;
	/** Sub-navigation items for collapsible sections */
	children?: NavSubItem[];
	/** Whether the item is disabled */
	disabled?: boolean;
}

interface SidebarNavProps {
	/** Navigation items */
	items: NavItemConfig[];
	/** Currently active route path */
	activeHref?: string;
	/** Called when a nav item is clicked */
	onNavigate?: (href: string) => void;
	/** Initial collapsed state */
	defaultCollapsed?: boolean;
	/** Brand / header content */
	header?: React.ReactNode;
	/** Footer content */
	footer?: React.ReactNode;
	/** Additional class */
	className?: string;
}

/**
 * `SidebarNav` is the main navigation sidebar for FlexPrice.
 *
 * Supports collapsible/expandable mode, nested sub-navigation with accordion
 * behaviour, active route highlighting, icon+label items, and optional
 * header/footer slots.
 *
 * @example
 * ```tsx
 * <SidebarNav
 *   items={navItems}
 *   activeHref="/billing/invoices"
 *   onNavigate={(href) => router.push(href)}
 * />
 * ```
 */
const SidebarNav: React.FC<SidebarNavProps> = ({
	items,
	activeHref = '',
	onNavigate,
	defaultCollapsed = false,
	header,
	footer,
	className,
}) => {
	const [collapsed, setCollapsed] = useState(defaultCollapsed);
	const [openSections, setOpenSections] = useState<Set<string>>(() => {
		// Auto-open section containing active route
		const initial = new Set<string>();
		items.forEach((item) => {
			if (item.children?.some((child) => activeHref.startsWith(child.href))) {
				initial.add(item.label);
			}
		});
		return initial;
	});

	const toggleSection = (label: string) => {
		setOpenSections((prev) => {
			const next = new Set(prev);
			if (next.has(label)) {
				next.delete(label);
			} else {
				next.add(label);
			}
			return next;
		});
	};

	const handleClick = (href: string) => {
		onNavigate?.(href);
	};

	const isActive = (href: string) => activeHref === href || activeHref.startsWith(href + '/');

	return (
		<aside
			className={cn(
				'flex flex-col h-full bg-[#f9f9f9] border-r border-gray-300 transition-all duration-200',
				collapsed ? 'w-16' : 'w-60',
				className,
			)}
		>
			{/* Header */}
			{header && !collapsed && (
				<div className="px-3 py-4 border-b border-gray-200">{header}</div>
			)}

			{/* Collapse toggle */}
			<div className={cn('flex items-center px-3 py-2', collapsed ? 'justify-center' : 'justify-end')}>
				<button
					onClick={() => setCollapsed(!collapsed)}
					className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500"
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto px-2 py-1">
				<ul className="space-y-0.5">
					{items.map((item) => {
						const Icon = item.icon;
						const hasChildren = item.children && item.children.length > 0;
						const isOpen = openSections.has(item.label);
						const isSectionActive = isActive(item.href) ||
							(hasChildren && item.children?.some((c) => isActive(c.href)));

						return (
							<li key={item.label}>
								<button
									onClick={() => {
										if (hasChildren) {
											toggleSection(item.label);
											if (!isOpen) handleClick(item.href);
										} else {
											handleClick(item.href);
										}
									}}
									disabled={item.disabled}
									className={cn(
										'w-full flex items-center gap-2 h-10 px-2 py-2 rounded-[6px] text-[14px] transition-all duration-200',
										isSectionActive
											? 'bg-zinc-200 border border-zinc-300 shadow-sm font-medium'
											: 'font-normal hover:bg-gray-100',
										item.disabled && 'opacity-50 cursor-not-allowed',
										collapsed && 'justify-center px-0',
									)}
									title={collapsed ? item.label : undefined}
								>
									<Icon
										className={cn(
											'size-5 shrink-0',
											isSectionActive ? 'text-blue-600' : 'text-[#3F3F46]',
										)}
										strokeWidth={1.5}
									/>
									{!collapsed && (
										<>
											<span className="flex-1 text-left truncate select-none">
												{item.label}
											</span>
											{hasChildren && (
												<ChevronDown
													className={cn(
														'size-4 text-gray-400 transition-transform duration-200',
														isOpen && 'rotate-180',
													)}
												/>
											)}
										</>
									)}
								</button>

								{/* Sub-items */}
								{hasChildren && isOpen && !collapsed && (
									<ul className="ml-4 mt-1 mb-2 pl-3 border-l border-gray-200 space-y-0.5">
										{item.children?.map((sub) => {
											const SubIcon = sub.icon;
											const subActive = isActive(sub.href);
											return (
												<li key={sub.href}>
													<button
														onClick={() => handleClick(sub.href)}
														className={cn(
															'w-full flex items-center gap-2 h-8 px-2 rounded-[6px] text-[13px] transition-colors',
															subActive
																? 'bg-gray-100 font-medium text-foreground'
																: 'text-gray-600 hover:bg-gray-50 font-light',
														)}
													>
														{SubIcon && (
															<SubIcon
																className={cn(
																	'size-4',
																	subActive ? 'text-blue-600' : 'text-[#52525B]',
																)}
																strokeWidth={1.5}
															/>
														)}
														<span className="truncate">{sub.label}</span>
													</button>
												</li>
											);
										})}
									</ul>
								)}
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Footer */}
			{footer && !collapsed && (
				<div className="px-3 py-3 border-t border-gray-200 mt-auto">{footer}</div>
			)}
		</aside>
	);
};

export default SidebarNav;
export type { NavItemConfig, NavSubItem, SidebarNavProps };
