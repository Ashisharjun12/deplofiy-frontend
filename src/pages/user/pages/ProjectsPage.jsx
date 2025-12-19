import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  GitBranch, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  MoreHorizontal,
  Edit, 
  Trash2,
  Github,
  Globe,
  ArrowUpRight,
  Terminal,
  AlertCircle,
  Search,
  Code,
  Server,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Layers,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectAPI } from '@/api/api';
import { motion } from 'framer-motion';

// --- Status Configuration Helper ---
const getStatusConfig = (status) => {
  const statusKey = status || 'offline';
  
  switch (statusKey) {
    case 'DEPLOYED':
    case 'READY':
      return {
        dotColor: 'bg-green-500',
        pingColor: 'bg-green-400',
        badgeBg: 'bg-green-500/10',
        badgeText: 'text-green-400',
        badgeBorder: 'border-green-500/20',
        icon: CheckCircle2,
        label: 'Deployed',
        animate: true
      };
    case 'DEPLOYING':
    case 'QUEUED':
      return {
        dotColor: 'bg-blue-500',
        pingColor: 'bg-blue-400',
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-400',
        badgeBorder: 'border-blue-500/20',
        icon: Loader2,
        label: 'Building...',
        animate: true,
        spin: true
      };
    case 'FAILED':
      return {
        dotColor: 'bg-red-500',
        pingColor: 'bg-red-400',
        badgeBg: 'bg-red-500/10',
        badgeText: 'text-red-400',
        badgeBorder: 'border-red-500/20',
        icon: XCircle,
        label: 'Failed',
        animate: false
      };
    default:
      return {
        dotColor: 'bg-neutral-500',
        pingColor: 'bg-neutral-400',
        badgeBg: 'bg-neutral-500/10',
        badgeText: 'text-neutral-400',
        badgeBorder: 'border-neutral-500/20',
        icon: CircleDashed,
        label: 'Not Started',
        animate: false
      };
  }
};

// --- Spotlight Card Component ---
const SpotlightCard = ({ children, className = "", onClick }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#0A0A0A] cursor-pointer ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

// --- Threads Project Card Component ---
const ThreadsProjectCard = ({ project, deploymentStatuses, onEdit, onDelete, navigate }) => {
  const currentStatus = project.deployment 
    ? (deploymentStatuses[project.deployment.id]?.status || project.deployment.status)
    : null;
  
  const statusKey = currentStatus || 'offline';
  const framework = project.frameworkPreset?.name || 'Unknown';
  const frameworkImageUrl = project.frameworkPreset?.images?.urls?.[0];
  
  const gitUrl = project.gitUrl || '';
  const deploymentUrl = project.subDomain 
    ? `https://${project.subDomain}.deplofy.cloud`
    : null;
  const customDomain = project.customDomain || null;

  const statusConfig = getStatusConfig(statusKey);
  const StatusIcon = statusConfig.icon;

  return (
    <SpotlightCard 
      className="group flex flex-col p-6 hover:shadow-2xl transition-all duration-500"
      onClick={() => navigate(`/workspace/projects/${project.id}`)}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
              {frameworkImageUrl ? (
                <img 
                  src={frameworkImageUrl} 
                  alt={framework}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <div className="w-7 h-7 bg-neutral-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-neutral-400">{framework.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            
            {/* Status Dot - No Blinking */}
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.dotColor}`}></span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight text-neutral-100 group-hover:text-white transition-colors cursor-pointer flex items-center gap-2 truncate">
              {project.name}
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-neutral-500 flex-shrink-0" />
            </h3>
            <div className="flex items-center gap-2 text-neutral-500 text-xs mt-1.5 font-medium capitalize">
              {framework}
            </div>
          </div>
        </div>
        
        {/* Side Badge */}
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border flex items-center gap-1.5 flex-shrink-0 ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeBorder}`}>
          <StatusIcon size={10} className={statusConfig.spin ? 'animate-spin' : ''} />
          {statusConfig.label}
        </div>
      </div>

      {/* URLs Section */}
      <div className="space-y-3 mb-6">
        {/* GitHub URL */}
        {gitUrl && (
          <a
            href={gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={16} className="text-neutral-500 group-hover/link:text-white transition-colors" />
            <span className="truncate flex-1">{gitUrl.replace(/^https?:\/\//, '').replace(/\.git$/, '')}</span>
            <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}

        {/* Deployment URL */}
        {deploymentUrl && (
          <a
            href={deploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe size={16} className="text-neutral-500 group-hover/link:text-white transition-colors" />
            <span className="truncate flex-1">{project.subDomain}.deplofy.cloud</span>
            <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}

        {/* Custom Domain */}
        {customDomain ? (
          <a
            href={`https://${customDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe size={16} className="text-neutral-500 group-hover/link:text-white transition-colors" />
            <span className="truncate flex-1">{customDomain}</span>
            <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/workspace/projects/${project.id}?tab=domains`);
            }}
            className="flex items-center gap-3 text-sm text-neutral-500 hover:text-white transition-colors group/link w-full"
          >
            <Plus size={16} className="text-neutral-500 group-hover/link:text-white transition-colors" />
            <span className="flex-1 text-left">Add Custom Domain</span>
          </button>
        )}
      </div>

      {/* Card Footer - Actions */}
      <div className="flex items-center justify-end pt-4 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl bg-neutral-900 border-neutral-800">
            <DropdownMenuItem
              className="rounded-xl cursor-pointer text-neutral-200 hover:text-white hover:bg-neutral-800"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project, e);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project, e);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SpotlightCard>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // Store all projects for filtering
  const [loading, setLoading] = useState(true);
  const [deploymentStatuses, setDeploymentStatuses] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'frontend', 'backend', 'fullstack'
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  // Poll deployment status every 3 seconds for active deployments
  useEffect(() => {
    const activeDeployments = projects
      .filter((p) => p.deployment && (p.deployment.status === 'QUEUED' || p.deployment.status === 'DEPLOYING'))
      .map((p) => p.deployment.id);

    if (activeDeployments.length === 0) return;

    const pollStatus = async () => {
      for (const deploymentId of activeDeployments) {
        try {
          const response = await projectAPI.getDeploymentStatus(deploymentId);
          if (response.success) {
            setDeploymentStatuses((prev) => ({
              ...prev,
              [deploymentId]: response.data,
            }));

            // Refresh projects if status changed
            const updatedProject = projects.find((p) => p.deployment?.id === deploymentId);
            if (updatedProject && response.data.status !== updatedProject.deployment.status) {
              await fetchProjects(currentPage);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch status for deployment ${deploymentId}:`, error);
        }
      }
    };

    // Poll immediately, then every 3 seconds
    pollStatus();
    const interval = setInterval(pollStatus, 3000);

    return () => clearInterval(interval);
  }, [projects]);

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await projectAPI.getUserProjects(page, 6);
      if (response.success) {
        setAllProjects(response.data);
        setProjects(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search projects
  useEffect(() => {
    let filtered = allProjects;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(
        (project) => project.frameworkPreset?.type === filterType
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.frameworkPreset?.name?.toLowerCase().includes(query) ||
          project.gitUrl?.toLowerCase().includes(query)
      );
    }

    setProjects(filtered);
  }, [searchQuery, filterType, allProjects]);

  const handleEditClick = (project, e) => {
    e.stopPropagation();
    setSelectedProject(project);
    setEditName(project.name);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (project, e) => {
    e.stopPropagation();
    setSelectedProject(project);
    setDeleteConfirmText('');
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editName.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await projectAPI.updateProject(selectedProject.id, { name: editName.trim() });
      if (response.success) {
        await fetchProjects(currentPage);
        setEditDialogOpen(false);
        setSelectedProject(null);
        setEditName('');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (deleteConfirmText !== 'permanently delete') return;
    
    try {
      setSubmitting(true);
      const response = await projectAPI.deleteProject(selectedProject.id);
      if (response.success) {
        await fetchProjects(currentPage);
        setDeleteDialogOpen(false);
        setSelectedProject(null);
        setDeleteConfirmText('');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 sm:p-12">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">
              Projects
            </h1>
            <p className="text-muted-foreground text-lg font-medium tracking-tight mt-2">
              Manage your deployments and instances.
            </p>
          </div>
          <Button
            onClick={() => navigate('/workspace/add-project')}
            className="rounded-full h-11 px-6 cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 rounded-full border-border/50 bg-background/50 focus:bg-background transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-full border-border/50 bg-background/50 focus:bg-background">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="fullstack">Fullstack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Layout */}
      {projects.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 border border-border rounded-3xl bg-background/40">
            <GitBranch className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || filterType !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-muted-foreground mb-6 text-center">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Create your first project to start deploying'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button
                onClick={() => navigate('/workspace/add-project')}
                className="rounded-full h-11 px-6 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render Cards */}
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ThreadsProjectCard
                project={project}
                deploymentStatuses={deploymentStatuses}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                navigate={navigate}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrevPage}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={!pagination.hasNextPage}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter project name"
                className="rounded-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editName.trim()) {
                    handleEditSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditName('');
                setSelectedProject(null);
              }}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={!editName.trim() || submitting}
              className="rounded-full cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This will permanently delete the project, all its deployments, S3 files, and ECS tasks. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm">
                Type <span className="font-mono font-bold">permanently delete</span> to confirm
              </Label>
              <Input
                id="confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="permanently delete"
                className="rounded-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmText('');
                setSelectedProject(null);
              }}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              disabled={deleteConfirmText !== 'permanently delete' || submitting}
              variant="destructive"
              className="rounded-full cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
