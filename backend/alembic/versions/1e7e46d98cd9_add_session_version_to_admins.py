"""add_session_version_to_admins

Revision ID: 1e7e46d98cd9
Revises: 8d453b23c3ee
Create Date: 2026-08-29 20:32:18.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e7e46d98cd9'
down_revision: Union[str, Sequence[str], None] = '8d453b23c3ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('admins', sa.Column('session_version', sa.Integer(), server_default='1', nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('admins') as batch_op:
        batch_op.drop_column('session_version')
