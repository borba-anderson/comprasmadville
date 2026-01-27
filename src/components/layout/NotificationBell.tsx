import { Bell, Check, CheckCheck, Trash2, Package, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'status_change':
      return <Package className="w-4 h-4 text-primary" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    default:
      return <Info className="w-4 h-4 text-blue-500" />;
  }
}

function NotificationItem({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: () => void;
}) {
  return (
    <div
      className={cn(
        'p-3 border-b last:border-b-0 transition-colors cursor-pointer hover:bg-muted/50',
        !notification.read && 'bg-primary/5'
      )}
      onClick={onMarkAsRead}
    >
      <div className="flex gap-3">
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          !notification.read ? 'bg-primary/10' : 'bg-muted'
        )}>
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              'text-sm line-clamp-1',
              !notification.read ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
            )}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.description}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {formatDistanceToNow(new Date(notification.timestamp), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  const count = unreadCount();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center animate-pulse">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">Notificações</h3>
          <div className="flex items-center gap-1">
            {count > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={markAllAsRead}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar lidas
              </Button>
            )}
          </div>
        </div>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <>
            <ScrollArea className="max-h-80 overflow-y-auto" type="always">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                />
              ))}
            </ScrollArea>
            
            {/* Footer */}
            <div className="p-2 border-t bg-muted/30">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-8 text-xs text-muted-foreground gap-1.5"
                onClick={clearAll}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar todas
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Você será notificado sobre atualizações
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
