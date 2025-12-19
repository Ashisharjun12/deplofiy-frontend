import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, ExternalLink, Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { projectAPI } from '@/api/api';
import { useNavigate } from 'react-router-dom';

const CustomDomainsTab = ({ project }) => {
  const navigate = useNavigate();
  const [customDomain, setCustomDomain] = useState(project?.customDomain || '');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project?.customDomain) {
      verifyDomain();
    }
  }, [project?.customDomain]);

  const verifyDomain = async () => {
    if (!project?.customDomain) return;
    
    try {
      setVerifying(true);
      const response = await projectAPI.verifyCustomDomain(project.id);
      if (response.success) {
        setVerificationStatus(response);
      }
    } catch (error) {
      console.error('Failed to verify domain:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleAdd = () => {
    setDomainInput('');
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!domainInput.trim()) return;

    const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Basic validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(cleanDomain)) {
      setError('Please enter a valid domain (e.g., example.com or www.example.com)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await projectAPI.addCustomDomain(project.id, cleanDomain);
      
      if (response.success) {
        setCustomDomain(cleanDomain);
        setDialogOpen(false);
        setDomainInput('');
        // Refresh project data
        navigate(0); // Reload page to get updated project data
      }
    } catch (error) {
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to add custom domain');
      console.error('Failed to add domain:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${customDomain}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await projectAPI.removeCustomDomain(project.id);
      
      if (response.success) {
        setCustomDomain('');
        setVerificationStatus(null);
        // Refresh project data
        navigate(0); // Reload page to get updated project data
      }
    } catch (error) {
      console.error('Failed to delete domain:', error);
      alert(error.response?.data?.error || 'Failed to remove custom domain');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDNSInstructions = () => {
    if (!project?.subDomain) return null;
    const targetDomain = `${project.subDomain}.deplofy.cloud`;
    return {
      type: 'CNAME',
      name: customDomain === customDomain.split('.').slice(-2).join('.') ? '@' : customDomain.split('.')[0],
      value: targetDomain,
      targetDomain,
    };
  };

  const dnsInstructions = getDNSInstructions();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {customDomain ? (
        <>
          <Card className="rounded-3xl border-border/30 bg-background/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Domain</CardTitle>
                  <CardDescription>
                    Your custom domain configuration
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={verifyDomain}
                  disabled={verifying}
                  className="rounded-full"
                >
                  {verifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Globe size={20} className="text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{customDomain}</div>
                    <div className="flex items-center gap-3 mt-2">
                      {verificationStatus?.verified ? (
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle2 size={12} />
                          <span>DNS Verified</span>
                        </div>
                      ) : verificationStatus?.verified === false ? (
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                          <AlertCircle size={12} />
                          <span>DNS Not Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Loader2 size={12} className="animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      )}
                      <a
                        href={`https://${customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Visit <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={loading}
                  className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              {verificationStatus && !verificationStatus.verified && (
                <Alert className="border-yellow-500/20 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-sm">
                    {verificationStatus.message || 'DNS record is not correctly configured'}
                    {verificationStatus.details && (
                      <div className="mt-2 text-xs">
                        <p>Expected: {verificationStatus.details.expectedTarget}</p>
                        {verificationStatus.details.currentTarget && (
                          <p>Current: {verificationStatus.details.currentTarget}</p>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {dnsInstructions && (
                <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">DNS Configuration</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${dnsInstructions.name} CNAME ${dnsInstructions.value}`)}
                      className="h-7 text-xs rounded-full"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-20">Type:</span>
                      <code className="px-2 py-1 rounded bg-muted text-xs">{dnsInstructions.type}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-20">Name:</span>
                      <code className="px-2 py-1 rounded bg-muted text-xs">{dnsInstructions.name}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-20">Value:</span>
                      <code className="px-2 py-1 rounded bg-muted text-xs flex-1 truncate">{dnsInstructions.value}</code>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Add this CNAME record in your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.). 
                    DNS changes may take a few minutes to propagate.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="rounded-3xl border-border/30 bg-background/40 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No custom domain</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Add a custom domain to your deployment. We'll automatically configure DNS records via Cloudflare API.
            </p>
            <Button onClick={handleAdd} className="rounded-full h-11 px-6">
              <Plus className="mr-2 h-4 w-4" />
              Add Domain
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Domain Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogDescription>
              Add a custom domain to your deployment. DNS records will be automatically configured via Cloudflare API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={domainInput}
                onChange={(e) => {
                  setDomainInput(e.target.value);
                  setError('');
                }}
                placeholder="example.com or www.example.com"
                className="rounded-xl border-border/50 h-11 bg-background/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && domainInput.trim() && !loading) {
                    handleSave();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Enter your domain without http:// or https://. DNS records will be created automatically.
              </p>
            </div>
            {project?.subDomain && (
              <div className="p-3 rounded-xl border border-border/50 bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Will point to:</p>
                <code className="text-sm font-mono">{project.subDomain}.deplofy.cloud</code>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setError('');
                setDomainInput('');
              }}
              className="rounded-full h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!domainInput.trim() || loading}
              className="rounded-full h-11 px-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Domain
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomDomainsTab;
