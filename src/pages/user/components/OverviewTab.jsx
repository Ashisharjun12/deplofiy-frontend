import React from 'react';
import { GitBranch, ExternalLink, CheckCircle2, XCircle, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeploymentHistory from './DeploymentHistory';
import DeploymentLogs from './DeploymentLogs';

const OverviewTab = ({ 
  project, 
  selectedDeployment, 
  onSelectDeployment, 
  onDeleteDeployment,
  deploymentStatuses,
  onRedeploy,
  deploymentPage,
  setDeploymentPage,
  deploymentPagination
}) => {
  const getStatusBadge = () => {
    if (!selectedDeployment) return null;
    
    const currentStatus = deploymentStatuses[selectedDeployment.id]?.status || selectedDeployment.status;
    
    const statusConfig = {
      DEPLOYED: { icon: CheckCircle2, color: 'text-green-500 bg-green-500/10', label: 'Deployed' },
      DEPLOYING: { icon: Loader2, color: 'text-blue-500 bg-blue-500/10', label: 'Deploying' },
      QUEUED: { icon: Clock, color: 'text-blue-500 bg-blue-500/10', label: 'Queued' },
      FAILED: { icon: XCircle, color: 'text-red-500 bg-red-500/10', label: 'Failed' },
    };

    const config = statusConfig[currentStatus] || statusConfig.QUEUED;
    const Icon = config.icon;

    return (
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Project Info Card */}
      <Card className="rounded-3xl border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Repository:</span>
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {project.gitUrl}
            </a>
          </div>
          {project.subDomain && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">URL:</span>
              <a
                href={`https://${project.subDomain}.deplofy.cloud`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {project.subDomain}.deplofy.cloud
              </a>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            Created: {new Date(project.createdAt).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Deployment History */}
      <DeploymentHistory
        deployments={project.deployments}
        selectedDeployment={selectedDeployment}
        onSelectDeployment={onSelectDeployment}
        onDeleteDeployment={onDeleteDeployment}
        deploymentStatuses={deploymentStatuses}
        projectId={project.id}
        onRedeploy={onRedeploy}
      />

      {/* Deployment Pagination */}
      {deploymentPagination && deploymentPagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDeploymentPage(prev => Math.max(1, prev - 1))}
            disabled={!deploymentPagination.hasPrevPage}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {deploymentPagination.page} of {deploymentPagination.totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDeploymentPage(prev => Math.min(deploymentPagination.totalPages, prev + 1))}
            disabled={!deploymentPagination.hasNextPage}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Deployment Logs */}
      {selectedDeployment && (
        <DeploymentLogs 
          deploymentId={selectedDeployment.id} 
          project={project}
          deploymentStatus={deploymentStatuses[selectedDeployment.id]?.status || selectedDeployment.status}
        />
      )}
    </div>
  );
};

export default OverviewTab;

